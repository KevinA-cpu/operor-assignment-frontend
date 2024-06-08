'use client';

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IUser } from './entities/IUser';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function Content() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}?offset=${page}&limit=10`,
        {
          credentials: 'include',
        }
      );
      const newUsers: IUser[] = await res.json();
      setUsers([...users, ...newUsers]);
      setPage(page + 1);

      if (newUsers.length < 10) {
        setHasMore(false);
        toast({
          variant: 'default',
          title: 'You have reached the end of the list.',
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.response?.data.message ?? error.message,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <InfiniteScroll
      dataLength={users.length}
      next={fetchUsers}
      hasMore={hasMore}
      loader={<h4 className="mt-4 text-center">Loading...</h4>}
    >
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 ">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>
                {user.first_name} {user.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Email: {user.email}</CardDescription>
              <CardDescription>Gender: {user.gender}</CardDescription>
              <CardDescription>Days: {user.days}</CardDescription>
              <CardDescription>
                Meeting Days:{' '}
                {user.meetings.map((meeting) => (
                  <Badge key={meeting.id} className="mr-2">
                    {meeting.start_day} - {meeting.end_day}
                  </Badge>
                ))}
              </CardDescription>
              <CardDescription>
                Days Without Meetings: {user.days_without_meetings}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </InfiniteScroll>
  );
}
