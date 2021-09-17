import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "./styles";
import axios from "axios";
import { Link } from "react-router-dom";
import useInput from "@hooks/useInput";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { Redirect } from "react-router";
import {useForm, SubmitHandler} from "react-hook-form";
import { Formvalues } from "@pages/DirectMessage";
type SignupForm = {
  email:string;
  nickname:string;
  password:string;
  passwordcheck:string;
}
const SignUp: FC = () => {
  const {register, reset, handleSubmit, watch, formState} = useForm<SignupForm>({defaultValues:{email:"", password:"", nickname:"", passwordcheck:""}})
  const { data, error, mutate, isValidating } = useSWR("/api/users", fetcher); //
  const [email, onChangeEmail, setEmail] = useInput("");
  const [nickname, onChangeNickname, setNickname] = useInput("");
  const [password, _1, setPassword] = useInput(""); //비밀번호
  const [passwordCheck, _2, setPasswordCheck] = useInput(""); //비밀번호 확인, 둘이 같아야됌
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSingUpError] = useState("");
  const [signUpSuccess, setSingUpSuccess] = useState(false);

  const subscription = watch();

  useEffect(()=>{
    if(formState.isSubmitSuccessful){
      reset();
    }
  })

  const onChangePassword = useCallback((e) => {
    setMismatchError(subscription.passwordcheck !== subscription.password);
  }, [watch]);
  const onChangePasswordCheck = useCallback((e) => {
    setMismatchError(subscription.passwordcheck !== subscription.password);
  }, [watch]);
  const onSubmit:SubmitHandler<SignupForm> =
    (data) => {
    const {email, nickname, password} = data;
      if (!mismatchError) {
        axios.post("/api/users", { email, nickname, password }, {
          withCredentials: true
        })
          .catch((error) => {
            console.log(error.response)
          })
        ;
      }

    };
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input {...register('email', {required:"필수입력입니다", pattern:{
                value:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                message:"이메일 형식이 아닙니다."}})} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input {...register("nickname", {required:"필수 입력입니다"})} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input {...register('password',{required:'필수 입력입니다'})}/>
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              {...register('passwordcheck')}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;

