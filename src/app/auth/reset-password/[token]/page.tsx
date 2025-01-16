import React from "react";
import ResetPasswordPage from "~/app/_components/auth/resetPassword";

async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  return <ResetPasswordPage token={token} />;
}

export default ResetPassword;
