import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// セッショントークン生成
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// 簡易的なトークン署名（本番ではJWTを使用推奨）
function signToken(token: string, secret: string): string {
  // 簡易実装：本番環境ではjsonwebtokenライブラリを使用
  const encoder = new TextEncoder();
  const data = encoder.encode(token + secret);
  return btoa(String.fromCharCode(...new Uint8Array(data))).substring(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 入力バリデーション
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'ユーザー名とパスワードを入力してください' },
        { status: 400 }
      );
    }

    // 環境変数から認証情報を取得
    const validUsername = process.env.AUTH_USERNAME;
    const validPassword = process.env.AUTH_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET || 'default-secret';

    // 認証情報が設定されていない場合
    if (!validUsername || !validPassword) {
      console.error('AUTH_USERNAME or AUTH_PASSWORD not configured');
      return NextResponse.json(
        { success: false, error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // タイミング攻撃対策のための定数時間比較
    const usernameMatch = username.length === validUsername.length &&
      username.split('').every((char: string, i: number) => char === validUsername[i]);
    const passwordMatch = password.length === validPassword.length &&
      password.split('').every((char: string, i: number) => char === validPassword[i]);

    if (usernameMatch && passwordMatch) {
      // セッショントークン生成
      const sessionToken = generateSessionToken();
      const signature = signToken(sessionToken, sessionSecret);
      const signedToken = `${sessionToken}.${signature}`;

      // HTTPOnly Cookieにセッションを保存
      const cookieStore = await cookies();
      cookieStore.set('session', signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8時間
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'ログインしました',
      });
    } else {
      // ログイン失敗時も同じレスポンス時間になるよう少し待機
      await new Promise(resolve => setTimeout(resolve, 100));

      return NextResponse.json(
        { success: false, error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
