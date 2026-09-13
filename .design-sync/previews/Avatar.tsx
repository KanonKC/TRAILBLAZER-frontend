import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "trailblazer-ui";

const jeremy = "https://static-cdn.jtvnw.net/jtv_user_pictures/e0bdb40f-d002-4ca0-ac86-937867b93851-profile_image-300x300.png";

export const Sizes = () => (
  <div className="p-6 flex items-center gap-6">
    <Avatar size="sm"><AvatarImage src={jeremy} alt="MrJeremy" /><AvatarFallback>MJ</AvatarFallback></Avatar>
    <Avatar><AvatarImage src={jeremy} alt="MrJeremy" /><AvatarFallback>MJ</AvatarFallback></Avatar>
    <Avatar size="lg"><AvatarImage src={jeremy} alt="MrJeremy" /><AvatarFallback>MJ</AvatarFallback></Avatar>
  </div>
);

export const FallbackAndBadge = () => (
  <div className="p-6 flex items-center gap-6">
    <Avatar size="lg"><AvatarFallback>MJ</AvatarFallback></Avatar>
    <Avatar size="lg"><AvatarFallback>นม</AvatarFallback><AvatarBadge className="bg-green-500" /></Avatar>
    <Avatar size="lg"><AvatarImage src={jeremy} alt="MrJeremy" /><AvatarFallback>MJ</AvatarFallback><AvatarBadge className="bg-primary" /></Avatar>
  </div>
);

export const Group = () => (
  <div className="p-6">
    <AvatarGroup>
      <Avatar><AvatarImage src={jeremy} alt="MrJeremy" /><AvatarFallback>MJ</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  </div>
);
