---
title: "The Rails 8 authentication generator"
excerpt: "What you get out of the box, and what you still need to add."
date: "2026-09-06T09:00:00.000Z"
tags: ["rails"]
authors: ["dev"]
cover: "./cover.jpg"
---

Rails 8 includes an authentication generator. It's not a gem you depend on: it writes plain code into your app, which you own and can change.

```bash
bin/rails generate authentication
bin/rails db:migrate
```

## What you get

- `User` with `has_secure_password` and a `Session` model, one row per signed-in device.
- An `Authentication` concern with `require_authentication` and `allow_unauthenticated_access`.
- Sign in, sign out and password reset by email, with rate limiting on the sign-in form.

```ruby
class PostsController < ApplicationController
  allow_unauthenticated_access only: %i[index show]

  def create
    @post = Current.user.posts.create!(post_params)
    redirect_to @post
  end
end
```

## What you still need to add

1. **Sign up.** The generator intentionally leaves registration to you.
2. **Email confirmation**, if accounts must be verified.
3. **A "sign out everywhere" button**: destroy every session of the user.

```ruby
class RegistrationsController < ApplicationController
  allow_unauthenticated_access
  rate_limit to: 10, within: 3.minutes, only: :create

  def create
    user = User.create!(params.expect(user: %i[email_address password password_confirmation]))
    start_new_session_for(user)
    redirect_to root_path
  end
end
```
