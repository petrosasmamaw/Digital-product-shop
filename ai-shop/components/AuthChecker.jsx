"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthSession } from "@/redux/userSlice";

export default function AuthChecker() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  return null;
}