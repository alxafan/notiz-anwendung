import React from "react";
import ResetPasswordPage from "~/app/_components/auth/resetPassword";
// token aus der url bekommen und an die Komponente übergeben ( ging nicht im client also extra file um es an die file die den client  nutzt zu übergeben)
async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  return <ResetPasswordPage token={token} />;
}

export default ResetPassword;
