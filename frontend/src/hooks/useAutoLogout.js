import { logout } from "@/endpoints/api";
import { useEffect, useRef } from "react";

const AUTO_LOGOUT_TIME = 60 * 60 * 1000;
// const AUTO_LOGOUT_TIME = 60 * 1000; // 1 minute for testing

function useAutoLogout() {
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, []);
}

export default useAutoLogout;
