
import React, { useCallback, useState, VFC } from "react";
import useSWR from "swr";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import { CollapseButton } from "@components/DMList/style";
import { NavLink } from "react-router-dom";

const ChannelList: VFC = ({})=>{
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const {
    data: userData,
    mutate: mutateUser
  } = useSWR<IUser>("/api/users", fetcher, { dedupingInterval: 2000 }); //
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null
    , fetcher);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const toggleChannelCollapse = useCallback(()=>{
    setChannelCollapse((prev)=>!prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
        channelData?.map((channel) => {
          return (
            <NavLink
              key={channel.name}
              activeClassName="selected"
              to={`/workspace/${workspace}/channel/${channel.name}`}
            >
              <span># {channel.name}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}
export default ChannelList;