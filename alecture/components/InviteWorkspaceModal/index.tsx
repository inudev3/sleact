import React, { VFC } from "react";
import Modal from "@components/Modal";
import { Button, Input, Label } from "@pages/signup/styles";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}
type FormValue = {
  email: string;
}
const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal }) => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const {
    data: userData,
    error,
    mutate: mutateMember
  } = useSWR<IUser[]>(`/api/workspaces/${workspace}/members`, fetcher);
  const { register, handleSubmit } = useForm({ defaultValues: { email: "" } });

  const onInviteMember: SubmitHandler<FormValue> = (data) => {
    const { email } = data;
    axios.post(`/api/workspaces/${workspace}/members`, { email }, { withCredentials: true })
      .then(() => mutateMember(userData, true))
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: "bottom-center" });
      });
  };

  return (<Modal show={show} onCloseModal={onCloseModal}>
    <form onSubmit={handleSubmit(onInviteMember)}>
      <Label id="workspace-label">
        <span>워크스페이스 이름</span>
        <Input {...register("email", { required: "입력값은 필수입니다." })} />
      </Label>
      <Button type="submit">초대하기</Button>
    </form>
  </Modal>);
};

export default InviteWorkspaceModal;