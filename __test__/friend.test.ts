import friend from '../class/friend'

describe('follow/unfollow test', () => {
    beforeAll(() => {
        friend.unfollowuser('12', '82');
    })

    test('follow id 82 from id 12.', async () => {
        const followuser = await friend.followuser('12', '82');
        expect(followuser).toBe('what2 added in your friend list.');
    })

    test('unfollow id 82 from id 12', async () => {
        const unfollow = await friend.unfollowuser('12', '82');
        expect(unfollow).toBe('what2 deleted from your friend list.');
    })
})

const friendlist = [{
    id: 12,
    name: "js.2"
}];

describe('following list', () => {
    test('following list of id 7', async () => {
        const getfollowinglist = await friend.getfollowinglist("7");
        expect(getfollowinglist).toMatchObject(friendlist);
    })

    test('follower list of id 7', async () => {
        const getfollowerlist = await friend.getfollowerlist("7");
        expect(getfollowerlist).toMatchObject(friendlist);
    })
})