import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  /********** Types **********/
  type Notice = {
    id : Nat;
    title : Text;
    body : Text;
    date : Time.Time;
    isPublished : Bool;
  };

  module Notice {
    public func compare(notice1 : Notice, notice2 : Notice) : Order.Order {
      Nat.compare(notice2.id, notice1.id);
    };
  };

  type NewsEvent = {
    id : Nat;
    title : Text;
    body : Text;
    date : Time.Time;
    blobId : ?Storage.ExternalBlob;
    isPublished : Bool;
  };

  module NewsEvent {
    public func compare(newsEvent1 : NewsEvent, newsEvent2 : NewsEvent) : Order.Order {
      Nat.compare(newsEvent2.id, newsEvent1.id);
    };
  };

  type SubjectResult = {
    subject : Text;
    marks : Nat;
    grade : Text;
  };

  type StudentResult = {
    id : Nat;
    rollNumber : Text;
    studentName : Text;
    studentClass : Text;
    subjects : [SubjectResult];
    academicYear : Text;
    blobId : ?Storage.ExternalBlob;
  };

  type GalleryItem = {
    id : Nat;
    title : Text;
    blobId : Storage.ExternalBlob;
    mediaType : Text;
    date : Time.Time;
  };

  module GalleryItem {
    public func compare(galleryItem1 : GalleryItem, galleryItem2 : GalleryItem) : Order.Order {
      Nat.compare(galleryItem2.id, galleryItem1.id);
    };
  };

  type StaffMember = {
    id : Nat;
    name : Text;
    designation : Text;
    bio : Text;
    blobId : ?Storage.ExternalBlob;
  };

  type PrincipalMessage = {
    message : Text;
    principalName : Text;
    blobId : ?Storage.ExternalBlob;
  };

  type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    date : Time.Time;
  };

  type SchoolInfo = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    mapEmbedUrl : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  /********** State **********/
  let notices = Map.empty<Nat, Notice>();
  let newsEvents = Map.empty<Nat, NewsEvent>();
  let studentResults = Map.empty<Nat, StudentResult>();
  let galleryItems = Map.empty<Nat, GalleryItem>();
  let staffMembers = Map.empty<Nat, StaffMember>();
  let contactMessages = Map.empty<Nat, ContactMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var principalMessage : ?PrincipalMessage = null;
  var schoolInfo : ?SchoolInfo = null;

  var nextNoticeId = 1;
  var nextNewsEventId = 1;
  var nextResultId = 1;
  var nextGalleryId = 1;
  var nextStaffId = 1;
  var nextContactId = 1;

  /********** Authorization **********/
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /********** Blob Storage **********/
  include MixinStorage();

  /********** User Profile Functions **********/
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /********** Notices **********/
  public shared ({ caller }) func createNotice(title : Text, body : Text) : async Notice {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create notices");
    };

    let id = nextNoticeId;
    nextNoticeId += 1;

    let notice : Notice = {
      id;
      title;
      body;
      date = Time.now();
      isPublished = false;
    };

    notices.add(id, notice);
    notice;
  };

  public query ({ caller }) func getNotices() : async [Notice] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all notices");
    };
    notices.values().toArray().sort();
  };

  public query ({ caller }) func getPublishedNotices() : async [Notice] {
    notices.values().filter(func(n) { n.isPublished }).toArray();
  };

  public shared ({ caller }) func updateNotice(notice : Notice) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update notices");
    };

    if (not notices.containsKey(notice.id)) {
      Runtime.trap("Notice not found");
    };
    notices.add(notice.id, notice);
  };

  public shared ({ caller }) func deleteNotice(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete notices");
    };

    if (not notices.containsKey(id)) {
      Runtime.trap("Notice not found");
    };
    notices.remove(id);
  };

  public shared ({ caller }) func publishNotice(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can publish notices");
    };

    switch (notices.get(id)) {
      case (null) { Runtime.trap("Notice not found") };
      case (?notice) {
        let updatedNotice : Notice = {
          id = notice.id;
          title = notice.title;
          body = notice.body;
          date = notice.date;
          isPublished = true;
        };
        notices.add(id, updatedNotice);
      };
    };
  };

  /********** News/Events **********/
  public shared ({ caller }) func createNewsEvent(title : Text, body : Text, blobId : ?Storage.ExternalBlob) : async NewsEvent {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create news/events");
    };

    let id = nextNewsEventId;
    nextNewsEventId += 1;

    let newsEvent : NewsEvent = {
      id;
      title;
      body;
      date = Time.now();
      blobId;
      isPublished = false;
    };

    newsEvents.add(id, newsEvent);
    newsEvent;
  };

  public query ({ caller }) func getNewsEvents() : async [NewsEvent] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all news/events");
    };
    newsEvents.values().toArray().sort();
  };

  public query ({ caller }) func getPublishedNewsEvents() : async [NewsEvent] {
    newsEvents.values().filter(func(n) { n.isPublished }).toArray();
  };

  public shared ({ caller }) func updateNewsEvent(newsEvent : NewsEvent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update news/events");
    };

    if (not newsEvents.containsKey(newsEvent.id)) {
      Runtime.trap("News/Event not found");
    };
    newsEvents.add(newsEvent.id, newsEvent);
  };

  public shared ({ caller }) func deleteNewsEvent(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete news/events");
    };

    if (not newsEvents.containsKey(id)) {
      Runtime.trap("News/Event not found");
    };
    newsEvents.remove(id);
  };

  public shared ({ caller }) func publishNewsEvent(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can publish news/events");
    };

    switch (newsEvents.get(id)) {
      case (null) { Runtime.trap("News/Event not found") };
      case (?newsEvent) {
        let updatedNewsEvent : NewsEvent = {
          id = newsEvent.id;
          title = newsEvent.title;
          body = newsEvent.body;
          date = newsEvent.date;
          blobId = newsEvent.blobId;
          isPublished = true;
        };
        newsEvents.add(id, updatedNewsEvent);
      };
    };
  };

  /********** Student Results **********/
  public shared ({ caller }) func addStudentResult(rollNumber : Text, studentName : Text, studentClass : Text, subjects : [SubjectResult], academicYear : Text, blobId : ?Storage.ExternalBlob) : async StudentResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add student results");
    };

    let id = nextResultId;
    nextResultId += 1;

    let result : StudentResult = {
      id;
      rollNumber;
      studentName;
      studentClass;
      subjects;
      academicYear;
      blobId;
    };

    studentResults.add(id, result);
    result;
  };

  public shared ({ caller }) func updateStudentResult(result : StudentResult) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update student results");
    };

    if (not studentResults.containsKey(result.id)) {
      Runtime.trap("Result not found");
    };
    studentResults.add(result.id, result);
  };

  public shared ({ caller }) func deleteStudentResult(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete student results");
    };

    if (not studentResults.containsKey(id)) {
      Runtime.trap("Result not found");
    };
    studentResults.remove(id);
  };

  public query ({ caller }) func searchResultsByRollNumber(rollNumber : Text) : async [StudentResult] {
    studentResults.filter(func(_k, v) { v.rollNumber == rollNumber }).values().toArray();
  };

  public query ({ caller }) func getAllResults() : async [StudentResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all results");
    };
    studentResults.values().toArray();
  };

  /********** Gallery **********/
  public shared ({ caller }) func addGalleryItem(title : Text, blobId : Storage.ExternalBlob, mediaType : Text) : async GalleryItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };

    let id = nextGalleryId;
    nextGalleryId += 1;

    let item : GalleryItem = {
      id;
      title;
      blobId;
      mediaType;
      date = Time.now();
    };

    galleryItems.add(id, item);
    item;
  };

  public shared ({ caller }) func deleteGalleryItem(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };

    if (not galleryItems.containsKey(id)) {
      Runtime.trap("Gallery item not found");
    };
    galleryItems.remove(id);
  };

  public query ({ caller }) func getGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray().sort();
  };

  /********** Staff **********/
  public shared ({ caller }) func addStaffMember(name : Text, designation : Text, bio : Text, blobId : ?Storage.ExternalBlob) : async StaffMember {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add staff members");
    };

    let id = nextStaffId;
    nextStaffId += 1;

    let staff : StaffMember = {
      id;
      name;
      designation;
      bio;
      blobId;
    };

    staffMembers.add(id, staff);
    staff;
  };

  public shared ({ caller }) func updateStaffMember(staff : StaffMember) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update staff members");
    };

    if (not staffMembers.containsKey(staff.id)) {
      Runtime.trap("Staff member not found");
    };
    staffMembers.add(staff.id, staff);
  };

  public shared ({ caller }) func deleteStaffMember(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete staff members");
    };

    if (not staffMembers.containsKey(id)) {
      Runtime.trap("Staff member not found");
    };
    staffMembers.remove(id);
  };

  public query ({ caller }) func getStaffMembers() : async [StaffMember] {
    staffMembers.values().toArray();
  };

  /********** Principal Message **********/
  public shared ({ caller }) func setPrincipalMessage(message : Text, principalName : Text, blobId : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set principal message");
    };

    principalMessage := ?{
      message;
      principalName;
      blobId;
    };
  };

  public query ({ caller }) func getPrincipalMessage() : async ?PrincipalMessage {
    principalMessage;
  };

  /********** Contact Messages **********/
  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, phone : Text, message : Text) : async () {
    let id = nextContactId;
    nextContactId += 1;

    let contactMessage : ContactMessage = {
      id;
      name;
      email;
      phone;
      message;
      date = Time.now();
    };

    contactMessages.add(id, contactMessage);
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  public shared ({ caller }) func deleteContactMessage(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete contact messages");
    };

    if (not contactMessages.containsKey(id)) {
      Runtime.trap("Contact message not found");
    };
    contactMessages.remove(id);
  };

  /********** School Info **********/
  public shared ({ caller }) func setSchoolInfo(name : Text, address : Text, phone : Text, email : Text, mapEmbedUrl : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update school info");
    };

    schoolInfo := ?{
      name;
      address;
      phone;
      email;
      mapEmbedUrl;
    };
  };

  public query ({ caller }) func getSchoolInfo() : async ?SchoolInfo {
    schoolInfo;
  };
};
