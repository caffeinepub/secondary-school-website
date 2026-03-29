import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PrincipalMessage {
    message: string;
    blobId?: ExternalBlob;
    principalName: string;
}
export interface SubjectResult {
    marks: bigint;
    subject: string;
    grade: string;
}
export type Time = bigint;
export interface NewsEvent {
    id: bigint;
    title: string;
    isPublished: boolean;
    body: string;
    date: Time;
    blobId?: ExternalBlob;
}
export interface StaffMember {
    id: bigint;
    bio: string;
    name: string;
    designation: string;
    blobId?: ExternalBlob;
}
export interface ContactMessage {
    id: bigint;
    date: Time;
    name: string;
    email: string;
    message: string;
    phone: string;
}
export interface SchoolInfo {
    name: string;
    email: string;
    address: string;
    mapEmbedUrl: string;
    phone: string;
}
export interface Notice {
    id: bigint;
    title: string;
    isPublished: boolean;
    body: string;
    date: Time;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    date: Time;
    blobId: ExternalBlob;
    mediaType: string;
}
export interface StudentResult {
    id: bigint;
    studentName: string;
    subjects: Array<SubjectResult>;
    academicYear: string;
    rollNumber: string;
    blobId?: ExternalBlob;
    studentClass: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / ******** Gallery *********
     */
    addGalleryItem(title: string, blobId: ExternalBlob, mediaType: string): Promise<GalleryItem>;
    /**
     * / ******** Staff *********
     */
    addStaffMember(name: string, designation: string, bio: string, blobId: ExternalBlob | null): Promise<StaffMember>;
    /**
     * / ******** Student Results *********
     */
    addStudentResult(rollNumber: string, studentName: string, studentClass: string, subjects: Array<SubjectResult>, academicYear: string, blobId: ExternalBlob | null): Promise<StudentResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / ******** News/Events *********
     */
    createNewsEvent(title: string, body: string, blobId: ExternalBlob | null): Promise<NewsEvent>;
    /**
     * / ******** Notices *********
     */
    createNotice(title: string, body: string): Promise<Notice>;
    deleteContactMessage(id: bigint): Promise<void>;
    deleteGalleryItem(id: bigint): Promise<void>;
    deleteNewsEvent(id: bigint): Promise<void>;
    deleteNotice(id: bigint): Promise<void>;
    deleteStaffMember(id: bigint): Promise<void>;
    deleteStudentResult(id: bigint): Promise<void>;
    getAllResults(): Promise<Array<StudentResult>>;
    /**
     * / ******** User Profile Functions *********
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getNewsEvents(): Promise<Array<NewsEvent>>;
    getNotices(): Promise<Array<Notice>>;
    getPrincipalMessage(): Promise<PrincipalMessage | null>;
    getPublishedNewsEvents(): Promise<Array<NewsEvent>>;
    getPublishedNotices(): Promise<Array<Notice>>;
    getSchoolInfo(): Promise<SchoolInfo | null>;
    getStaffMembers(): Promise<Array<StaffMember>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishNewsEvent(id: bigint): Promise<void>;
    publishNotice(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchResultsByRollNumber(rollNumber: string): Promise<Array<StudentResult>>;
    /**
     * / ******** Principal Message *********
     */
    setPrincipalMessage(message: string, principalName: string, blobId: ExternalBlob | null): Promise<void>;
    /**
     * / ******** School Info *********
     */
    setSchoolInfo(name: string, address: string, phone: string, email: string, mapEmbedUrl: string): Promise<void>;
    /**
     * / ******** Contact Messages *********
     */
    submitContactMessage(name: string, email: string, phone: string, message: string): Promise<void>;
    updateNewsEvent(newsEvent: NewsEvent): Promise<void>;
    updateNotice(notice: Notice): Promise<void>;
    updateStaffMember(staff: StaffMember): Promise<void>;
    updateStudentResult(result: StudentResult): Promise<void>;
}
