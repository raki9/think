/**
 * 用户角色枚举
 */
export declare enum UserRole {
    normal = "normal",
    admin = "admin",
    superadmin = "superadmin"
}
/**
 * 用户状态枚举
 */
export declare enum UserStatus {
    normal = "normal",
    locked = "locked"
}
/**
 * 用户数据定义
 */
export interface IUser {
    id: string;
    name: string;
    password?: string;
    avatar?: string;
    email?: string;
    role: UserRole;
    status: UserStatus;
}
/**
 * 登录用户数据定义
 */
export interface ILoginUser extends IUser {
    token: string;
}
