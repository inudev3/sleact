import React from 'react';
import Workspace from '@layouts/Workspace';
import { Container, Header } from "@pages/Channel/style";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import { SubmitHandler } from "react-hook-form";
import { Formvalues } from "@pages/DirectMessage";
import { useParams } from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { IChannel, IUser } from "@typings/db";

const Channel = () => {
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
    const { data: myData } = useSWR<IUser>('/api/users', fetcher);
    const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
    const onSubmitForm:SubmitHandler<Formvalues> = (data)=>{
        const {text} = data;
        console.log('submit');
    }

    return(
      <Container>
        <Header>로그인 되셨습니다</Header>
        <ChatList />
        <ChatBox onSubmitForm={onSubmitForm} chat="" />
    </Container>);
};
export default Channel;