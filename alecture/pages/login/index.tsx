import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/signup/styles";
import useInput from "@hooks/useInput";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";

type Formvalues={
  email:string;
  password: string;
}

const LogIn: FC = () => {
  const { data, error, mutate, isValidating } = useSWR("/api/users", fetcher); //
  const {register, handleSubmit, reset , formState} = useForm<Formvalues>({defaultValues:{email:"", password:""}});

  useEffect(()=>{
    if(formState.isSubmitSuccessful){
      reset({email:"", password:""});
    }
  })

  const onSubmit: SubmitHandler<Formvalues> = (data)=> {
    const {email, password} = data;
    axios.post("/api/users/login", { email, password }, {
      withCredentials: true
    })
      .then((res) => {
        mutate(res.data, true);
      })

  };

  if (data === undefined) {
    return <div>로딩중...</div>;
  }
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }
  const{errors} =formState;
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input {...register('email', {required:'필수 입력입니다'})}/>
            {errors && errors.email?.message}
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input {...register('password', {required:'필수 입력입니다'})}/>
          </div>
          {errors && errors.password?.message}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
