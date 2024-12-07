"use client";

import React, { Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";

const ErrorCheck = () => {
  // GETパラメータ の error が EmailSignin の場合は、エラーメッセージを表示する
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "EmailSignin") {
      setTimeout(() => {
        toast({
          title:
            "エラーが発生しました。恐れ入りますが、職員までお問い合わせください。",
          variant: "destructive",
        });
      }, 1000);
    }
  }, [error]);

  return <></>;
};

type Props = {};

const FormSchema = z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください" })
    .email("メールアドレスを正しい形式で入力してください"),
});

const SignIn = (props: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await signIn("email", { email: data.email });
    } catch (error) {
      console.error(error);
      toast({
        title: "ログインに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2 justify-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="メールアドレス" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>で</p>
          <Button
            type="submit"
            disabled={
              !form.formState.isValid ||
              form.formState.isLoading ||
              form.formState.isSubmitting
            }
          >
            {(form.formState.isLoading || form.formState.isSubmitting) && (
              <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
            )}
            ログイン
          </Button>
        </form>
      </Form>

      <Suspense fallback={<></>}>
        <ErrorCheck />
      </Suspense>
    </>
  );
};

export default SignIn;
