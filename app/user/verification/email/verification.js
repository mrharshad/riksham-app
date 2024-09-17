"use client";
import { useRef, useState } from "react";
import style from "./verification.module.css";
import { useRouter } from "next/navigation";
import { Wait } from "@/app/Layouts/toastAndWait";

const Verification = ({ firstStep }) => {
  const router = useRouter();
  const [wait, setWait] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const tokenInput = useRef();

  const secondStep = async () => {
    const token = tokenInput.current.value.trim();
    if (token.length !== 6) {
      return alert("check 6 digit verification code");
    }
    if (password !== confirmPassword || password.length == 0) {
      return alert("Check Password");
    }
    setWait(true);
    const verify = await fetch(`/api/user/verification/email-token-verify`, {
      method: "POST",
      body: JSON.stringify({
        password,
        userType: token,
        firstStep,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { message, success } = await verify.json();
    alert(message);
    if (success) {
      router.replace("/");
      router.refresh();
    } else {
      router.refresh();
      setWait(false);
    }
  };

  const reSendToken = async () => {
    setWait(true);
    const verificationCode = await fetch(
      `/api/user/verification/email-token-send`,
      {
        method: "POST",
        body: JSON.stringify({
          firstStep,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { success, message } = await verificationCode.json();
    alert(message);
    if (success) {
      router.refresh();
      setWait(false);
    } else {
      router.refresh();
      setWait(false);
    }
  };

  return (
    <section className={style.section}>
      {wait ? <Wait /> : null}
      <form className={style.secondStep}>
        <p>Almost Done</p>
        <p className={style.identity}>
          identity: <span>{firstStep.email}</span>
        </p>

        <p className={style.resend}>
          Verification Code:{" "}
          <span onClick={reSendToken} type="button">
            re-send
          </span>
        </p>
        <button
          style={{
            background: `linear-gradient(to left bottom, #a9b8f3, ${
              password === confirmPassword && password.length > 0
                ? "green"
                : "red"
            })`,
          }}
          onClick={secondStep}
          type="button"
        >
          Done
        </button>
      </form>
    </section>
  );
};

export default Verification;
