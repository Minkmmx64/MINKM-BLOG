interface LeaveMsg {
  user: string;
  at?: string;
  created_at: string;
  pid: string | "root";
  emial?: string;
  phone?: string;
  leavemsg: string;
  isRead?: boolean;
}

const LeaveMsg: LeaveMsg[] = [
  {
    user: "用户",
    pid: "root",
    created_at: new Date().getFullYear().toString(),
    leavemsg: "留言",
  }
];