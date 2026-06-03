import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email:
                  credentials?.email,

                password:
                  credentials?.password,
              }),
            }
          );

          const user =
            await res.json();

          // login gagal
          if (!res.ok) {
            throw new Error(
              user.message ||
                "Login gagal"
            );
          }

          // wajib return object user
          if (user) {
            return user;
          }

          return null;
        } catch (error) {
          console.log(error);

          throw new Error(
            "Login gagal"
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: any) {
      // saat login pertama
      if (user) {
        token.id = user.id;

        token.role =
          user.role;

        token.accessToken =
          user.token;

        token.name =
          user.name;

        token.email =
          user.email;
      }

      return token;
    },

    async session({
      session,
      token,
    }: any) {
      // kirim data ke frontend
      if (session.user) {
        session.user.id =
          token.id;

        session.user.role =
          token.role;

        session.user.accessToken =
          token.accessToken;

        session.user.name =
          token.name;

        session.user.email =
          token.email;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret:
    process.env.NEXTAUTH_SECRET,
});

export {
  handler as GET,
  handler as POST,
};