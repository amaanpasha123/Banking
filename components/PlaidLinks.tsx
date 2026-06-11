import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';

interface PlaidLinkProps {
  user: User
  variant: 'primary' | 'ghost';
}

const PlaidLinks = ({ user, variant }: PlaidLinkProps) => {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getLinkToken = async () => {
      console.log('user received in PlaidLinks:', user);
      console.log('user.$id:', user?.$id);
      console.log('user.name:', user?.name);
      
      const data = await createLinkToken(user);
      console.log('createLinkToken response:', data);
      
      setToken(data?.linkToken || '');
    }
    getLinkToken();
  }, [user])

  const onSuccess = useCallback(async (public_token: string) => {
    await exchangePublicToken({
      publicToken: public_token,
      user,
    })
    router.push('/');
  }, [user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === 'primary' ? (
        <Button
          className='plaidlink-primary'
          onClick={() => open()}
          disabled={!ready}
        >
          Connect Bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button onClick={() => open()} disabled={!ready}>
          Connect Bank
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={!ready}>
          Connect Bank
        </Button>
      )}
    </>
  )
}

export default PlaidLinks;