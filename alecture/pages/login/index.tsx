import React, { FC, useCallback, useState } from "react";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/signup/styles";
import useInput from "@hooks/useInput";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import fetcher from "@utils/fetcher";


const LogIn: FC = () => {
  const { data, error, mutate, isValidating } = useSWR("/api/users", fetcher); //

  const [logInError, setLoginError] = useState(false);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput(""); //비밀번호
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setLoginError(false);
    axios.post("/api/users/login", { email, password }, {
      withCredentials: true
    })
      .then((res) => {
        mutate(res.data, true);
      })
      .catch(error => {
        setLoginError(error.response?.data);
      });
  }, [email, password]);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }
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
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>{logInError}</Error>}
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
