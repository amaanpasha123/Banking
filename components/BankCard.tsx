import React from 'react'
import Link from 'next/link'
import { formatAmount } from '@/lib/utils';

const BankCard = ({ account, userName, showBalance = true }: CreditCardProps) => {
  return (
    <div className='flex flex-col'>
      {/* Open the Link tag */}
      <Link href="/" className='bank-card'>
        
        {/* Put your card content INSIDE the Link container */}
        <div className='bank-card_content flex flex-col justify-between h-full p-5 w-full'>
          <div>
            <h1 className='text-white font-semibold text-16'>
              {account?.name || userName || "Amaan"}
            </h1>
            <p className='font-ibm-plex-serif font-black
            text-white'>
                {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className='flex flex-col gap-2'>
            <div className='flex justify-between'>
                <h1 className='text-12 font-semibold text-white'>
                    {userName}
                </h1>
                <h2 className='text-12 font-semibold text-white'>
                    ** / **
                </h2>
            </div>
            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
                **** **** **** <span className='text-16'>
                    {account.mask}
                </span>
            </p>
          </article>
        </div>

      </Link> {/* Close the Link tag here */}
    </div>
  )
}

export default BankCard;