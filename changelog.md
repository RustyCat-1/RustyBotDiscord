## Version 0.5a
I am working on a migration from `.command()` to `.execute()`, along with changing all commands to be stored in an object and be called as `execute(message, args)`. 

Userinfo command added.

TODO:
- Logic for inside DMs rather than GuildTextChannel's.
- Reaction roles
- Timeout, kick, ban (contrary to userinfo, it is to work only with userID/ping, to avoid banning the wrong user)

Rewordings, bugfixes, enhancements, etc.
