import React, { Dispatch, SetStateAction, useCallback, useEffect, VFC } from "react";
import { Button, Input, Label } from "@pages/signup/styles";
import Modal from "@components/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import useSWR from "swr";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (state: boolean) => void;
}


type Formvalues = {
  newChannel: string,
}
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

  const {
    data: userData,
    error,
    mutate: mutateUser
  } = useSWR<IUser | false>("/api/users", fetcher, { dedupingInterval: 2000 }); //
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null
    , fetcher);
  const { register, handleSubmit, formState, reset } = useForm<Formvalues>({ defaultValues: { newChannel: "" } });

  const onCreateChannel: SubmitHandler<Formvalues> = (data) => {
    const { newChannel } = data;

    axios.post(`/api/workspaces/${workspace}/channels`, {
        name: newChannel
      }, {
        withCredentials: true
      }
    ).then(() => {
      setShowCreateChannelModal(false);
      mutateChannel(channelData, true);
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: "bottom-center" });
    });
  };

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={handleSubmit(onCreateChannel)}>
        <Label id="channel-label">
          <span>채널</span>
          <Input {...register("newChannel", { required: "필수입력입니다." })} />
        </Label>

        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};
export default CreateChannelModal;