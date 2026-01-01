import { Types } from "mongoose";

interface FriendshipDoc {
  _id: Types.ObjectId;
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

interface UserDoc {
  _id: Types.ObjectId;
  toObject: () => any;
}

export type FriendshipStatus =
  | "self"
  | "friends"
  | "request_sent"
  | "request_received"
  | "rejected"
  | "none";

export const mapUserWithFriendshipStatus = (
  user: UserDoc,
  userId: string,
  friendships: FriendshipDoc[]
): any => {
  const userObj = user.toObject();

  if (user._id.toString() === userId) {
    return { ...userObj, friendshipStatus: "self" as FriendshipStatus };
  }

  const friendship = friendships.find(
    (f) =>
      f.requester.toString() === user._id.toString() ||
      f.recipient.toString() === user._id.toString()
  );

  if (friendship) {
    if (friendship.status === "accepted") {
      return { ...userObj, friendshipStatus: "friends" as FriendshipStatus, friendRequestId: friendship._id };
    } else if (friendship.status === "pending") {
      if (friendship.requester.toString() === userId) {
        return { ...userObj, friendshipStatus: "request_sent" as FriendshipStatus, friendRequestId: friendship._id };
      } else {
        return { ...userObj, friendshipStatus: "request_received" as FriendshipStatus, friendRequestId: friendship._id };
      }
    } else if (friendship.status === "rejected") {
      return { ...userObj, friendshipStatus: "rejected" as FriendshipStatus, friendRequestId: friendship._id };
    }
  }

  return { ...userObj, friendshipStatus: "none" as FriendshipStatus, friendRequestId: null };
};
