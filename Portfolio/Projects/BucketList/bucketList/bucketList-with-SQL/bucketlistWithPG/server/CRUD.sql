INSERT INTO hr.bucketlist_users (email)
    VALUES ('dariusmillerd@gmail.com')
    RETURNING *;




SELECT *,
item_id AS "_id",
is_complete AS "isComplete"
FROM hr.BUCKETLIST_ITEMS
WHERE user_id = 7;


UPDATE hr.BUCKETLIST_ITEMS
SET is_complete = NOT is_complete
WHERE item_id = 17
RETURNING *;

DELETE FROM hr.BUCKETLIST_ITEMS
WHERE item_id = id
RETURNING *;