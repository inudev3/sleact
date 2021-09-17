import React, { FC, useCallback, useState } from "react";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "./styles";
import axios from "axios";
import { Link } from "react-router-dom";
import useInput from "@hooks/useInput";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { Redirect } from "react-router";

const SignUp: FC = () => {

  const { data, error, mutate, isValidating } = useSWR("/api/users", fetcher); //
  const [email, onChangeEmail, setEmail] = useInput("");
  const [nickname, onChangeNickname, setNickname] = useInput("");
  const [password, _1, setPassword] = useInput(""); //비밀번호
  const [passwordCheck, _2, setPasswordCheck] = useInput(""); //비밀번호 확인, 둘이 같아야됌
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSingUpError] = useState("");
  const [signUpSuccess, setSingUpSuccess] = useState(false);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  }, [password, passwordCheck]);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  }, [passwordCheck]);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError) {
        setSingUpError("");
        setSingUpSuccess(false);
        console.log("서버로 회원가입하기");
        axios.post("/api/users", { email, nickname, password }, {
          withCredentials: true
        })
          .then((response) => {
            console.log(response);
            setSingUpSuccess(true);
          })
          .catch((error) => {
            console.log(error.response);
            setSingUpError(error.response.data);
          })
        ;
      }
      console.log(email, nickname, password, passwordCheck, mismatchError);
    },
    [email, nickname, password, passwordCheck]
  );
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
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

