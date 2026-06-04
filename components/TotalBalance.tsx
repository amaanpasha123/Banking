import AnimatedCounter from './AnimatedCounter'
import DaughnutCharts from './DaughnutCharts'
const TotalBalance = ({accounts =[] ,
    totalBanks,
    totalCurrentBalance}
    :TotlaBalanceBoxProps) => {
  return (
    <section className='total-balance'>
        <div className='total-balance-chart'>
            <DaughnutCharts accounts={accounts}/>
        </div>
        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                BankAccounts : {totalBanks}
            </h2>
        </div>
        <div className='flex flex-col gap-2'>
            <p className='total-balance-label'>
                Total Current balance 
            </p>
            <div className='total-balance-amount flex-center gap-2'>
                <AnimatedCounter amount={totalCurrentBalance} />
            </div>
        </div>
    </section>
  )
}

export default TotalBalance