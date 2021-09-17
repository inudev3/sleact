import React, { useEffect } from "react";
import Workspace from '@layouts/Workspace';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/DirectMessage/style';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
import { Redirect } from 'react-router-dom';
import ChatBox from '@components/ChatBox';
import {useForm,SubmitHandler} from "react-hook-form";
import axios from "axios";
import ChatList from "@components/ChatList";

export type Formvalues = {
  text:string,
}

  const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const onSubmitForm:SubmitHandler<Formvalues> = (data)=>{
    const {text} = data;
    console.log(text);
  }

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.email, { s: '24px', d: 'retro' })} alt={userData?.nickname} />
        <span>{userData?.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox onSubmitForm={onSubmitForm} chat="" />
    </Container>
  );
};

export default DirectMessage;
