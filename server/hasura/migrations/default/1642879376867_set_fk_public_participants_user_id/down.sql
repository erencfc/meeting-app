alter table "public"."participants" drop constraint "participants_user_id_fkey",
  add constraint "participants_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
