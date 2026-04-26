export type TAppHeaderUIProps = {
  userName: string | undefined;
  onConstructorClick: () => void;
  onFeedClick: () => void;
  onProfileClick: () => void;
  isConstructorActive?: boolean;
  isFeedActive?: boolean;
  isProfileActive?: boolean;
};
