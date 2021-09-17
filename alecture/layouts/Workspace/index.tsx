import React, { useCallback, FC, useState, useEffect, VFC } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import { Redirect, Route, Switch, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  AddButton,
  Channels,
  Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu, WorkspaceButton, WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from "@layouts/Workspace/style";
import gravatar from "gravatar";
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import { IChannel, IUser } from "@typings/db";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@components/Modal";
import { Button, Input, Label } from "@pages/signup/styles";
import useInput from "@hooks/useInput";
import { toast } from "react-toastify";
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";

const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

type Formvalues = {
  newWorkspace: string,
  newUrl: string
}

const Workspace: VFC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    mutate: mutateUser
  } = useSWR<IUser | false>("/api/users", fetcher, { dedupingInterval: 2000 }); //
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null
    , fetcher);
  const {
    data: memberData,
    mutate: mutateMember
  } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher, { dedupingInterval: 2000 });

  const { register, handleSubmit, formState, reset } = useForm<Formvalues>({
    defaultValues: {
      newWorkspace: "",
      newUrl: ""
    }
  });
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);


  const onLogOut = useCallback(() => {
    axios.post("/api/users/logout", null, {
      withCredentials: true
    })
      .then((res) => {
        mutateUser(false, true); //
      });
  }, []);
  const onclickUserProfile = useCallback(() => {

    setShowUserMenu(prev => !prev);
  }, []);
  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(prev => !prev);
  }, []);
  const onCreateWorkspace: SubmitHandler<Formvalues> = (data) => {
    const { newWorkspace: workspace, newUrl: url } = data;
    axios.post("/api/workspaces", {
      workspace,
      url
    }, { withCredentials: true })
      .then(() => {
        mutateUser(userData, true);
        setShowCreateWorkspaceModal(false);
      }).catch(error => {
      console.dir(error);
      toast.error(error.response?.data, { position: "bottom-center" });
    });
  };
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal(prev => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);


  if (!userData) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
        <span onClick={onclickUserProfile}>
          <ProfileImg src={gravatar.url(userData.email, { s: "28px", d: "retro" })} alt={userData.nickname} />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: "36px", d: "retro" })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
            </Menu>)}
        </span>
        </RightMenu>
      </Header>
      <button onClick={onLogOut}></button>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map(ws => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            Sleact
          </WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList/>
            <DMList/>
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channels/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={handleSubmit(onCreateWorkspace)}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input {...register("newWorkspace", { required: "필수입력입니다." })} />
          </Label>
          <Label id="workspace-url-lbael">
            <span>워크스페이스 url</span>
            <Input {...register("newUrl", { required: "필수입력입니다." })} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal}
                          setShowCreateChannelModal={setShowCreateChannelModal} />
      <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal}
                            setShowInviteWorkspaceModal={setShowInviteWorkspaceModal} />
      <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal}
                          setShowInviteChannelModal={setShowInviteChannelModal} />
    </div>
  );
};

export default Workspace;