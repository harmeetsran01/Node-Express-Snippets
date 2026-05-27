# Subscriber Model Schema & Workflow Explanation

## 1. Subscription Model Schema

From [subscription.model.js](src/models/subscription.model.js):

```javascript
const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,  // The user who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,  // The user being subscribed TO
        ref: "User"
    }
}, { timestamps: true })
```

**Two Key Fields:**

- **`subscriber`**: The user who clicks the "Subscribe" button
- **`channel`**: The user/channel being subscribed to

---

## 2. Aggregation Pipeline Breakdown (Lines 362-409)

The `getUserChannelProfile` function uses MongoDB's `$lookup` aggregation to fetch subscriber data.

### Stage 1: `$match` (Lines 363-366)

```javascript
{
  $match: {
    username: username?.toLowerCase()
  }
}
```

Finds the user document by username. Converts to lowercase for case-insensitive matching.

---

### Stage 2: First `$lookup` - Get Subscribers (Lines 368-375)

```javascript
{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "channel",
    as: "subscribers"
  }
}
```

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `from` | `"subscriptions"` | Collection to join |
| `localField` | `"_id"` | Current user's ID |
| `foreignField` | `"channel"` | Match against `channel` field in subscriptions |
| `as` | `"subscribers"` | Output array name |

**Result**: Finds all subscription documents where `channel` = current user's `_id` (people who subscribed TO this user).

---

### Stage 3: Second `$lookup` - Get Subscribed To (Lines 377-382)

```javascript
{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "subscriber",
    as: "subscribedTo"
  }
}
```

Same concept but reversed - finds all subscriptions where `subscriber` = current user's `_id` (people this user subscribed TO).

---

### Stage 4: `$addFields` - Computed Fields (Lines 384-395)

```javascript
{
  $addFields: {
    subscribersCount: { $size: "$subscribers" },
    subscribedToCount: { $size: "$subscribedTo" },
    isSubscribed: {
      $cond: {
        if: { $in: [req.user._id, "$subscribers.subscriber"] },
        then: true,
        else: false
      }
    }
  }
}
```

- **`subscribersCount`**: Counts the size of the subscribers array
- **`subscribedToCount`**: Counts the size of the subscribedTo array
- **`isSubscribed`**: Boolean - checks if `req.user._id` exists in the `subscribers.subscriber` field (is the current user subscribed to this channel?)

---

### Stage 5: `$project` - Select Fields (Lines 398-407)

```javascript
{
  $project: {
    fullName: 1,
    email: 1,
    username: 1,
    avatar: 1,
    coverImage: 1,
    subscribersCount: 1,
    subscribedToCount: 1,
    isSubscribed: 1
  }
}
```

Returns only these specific fields to the client.

---

## 3. Practical Example

**Scenario**: User A (channel) wants to view their profile

```
Database state:
- User A (username: "channelA", _id: "aaa111")
- User B (username: "subscriber1", _id: "bbb222")
- User C (username: "subscriber2", _id: "ccc333")

Subscriptions collection:
1. { subscriber: "bbb222", channel: "aaa111" }  // B subscribed to A
2. { subscriber: "ccc333", channel: "aaa111" }  // C subscribed to A
3. { subscriber: "aaa111", channel: "bbb222" }  // A subscribed to B
```

**When User A views their profile:**

1. `$match`: Finds User A by username
2. First `$lookup`: Finds subscriptions where `channel = "aaa111"` → returns documents #1 and #2 → `subscribers = [B, C]`
3. Second `$lookup`: Finds subscriptions where `subscriber = "aaa111"` → returns document #3 → `subscribedTo = [B]`
4. `$addFields`:
   - `subscribersCount`: 2
   - `subscribedToCount`: 1
   - `isSubscribed`: true (if viewing own profile, or if logged-in user subscribed)

**Final Output:**

```json
{
  "fullName": "Channel A",
  "username": "channelA",
  "avatar": "...",
  "subscribersCount": 2,
  "subscribedToCount": 1,
  "isSubscribed": true
}
```

---

## 4. Key Concepts Summary

| Term | Definition |
|------|------------|
| **subscriber** | User who is subscribing (the follower) |
| **channel** | User being subscribed to (the creator) |
| **subscribers** | Array of users who follow this channel |
| **subscribedTo** | Array of channels this user follows |
| **subscribersCount** | Total number of followers |
| **subscribedToCount** | Total number of channels followed |
| **isSubscribed** | Boolean indicating if current user follows this channel |