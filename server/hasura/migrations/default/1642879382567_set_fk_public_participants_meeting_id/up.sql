alter table "public"."participants" drop constraint "participants_meeting_id_fkey",
  add constraint "participants_meeting_id_fkey"
  foreign key ("meeting_id")
  references "public"."meetings"
  ("id") on update restrict on delete cascade;
