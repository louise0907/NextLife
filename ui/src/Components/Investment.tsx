import { useState, useEffect, ReactNode } from 'react'

//Import APIS
import NetworthFinder from '../Apis/NetworthFinder'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid'

interface Data {
  id: number
  name: string
  value: number
  base_value: number
  investment: boolean
  profit_myr: number
  profit_percentage: number
  date: Date
}

const Investment = () => {
  const [datas, setDatas] = useState<Data[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalCapital, setTotalCapital] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  let value = 0
  let capital = 0

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Data
    direction: string
  }>({
    key: 'id',
    direction: 'desc',
  })

  const handleSort = (key: keyof Data) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setDatas(
      [...datas].sort((a, b) => {
        // Ensure that TypeScript recognizes the key as a valid property of Data
        const aValue = a[key]
        const bValue = b[key]
        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
      })
    )
    setSortConfig({ key, direction })
  }

  const calc = () => {
    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].value
      capital = capital + datas[i].base_value
    }

    setTotalValue(value)
    setTotalCapital(capital)
    setTotalProfit(value - capital)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await NetworthFinder.get('/')
        if (response.data.data.networth.length !== 0) {
          // Filter and update datas state with only invest true data
          // const filteredData: Data[] = response.data.data.networth.filter(
          //   (data: Data) => data.investment
          // )
          // setDatas(filteredData)

          const filteredData: Data[] = response.data.data.networth.filter(
            (data: Data) => data.investment
          )
          console.log('Filtered Data:', filteredData) // Log the filtered data
          // Initialize profit_myr and profit_percentage properties for each data item
          const updatedData: Data[] = filteredData.map((data: Data) => ({
            ...data,
            profit_myr: data.value - data.base_value, // Calculate initial profit_myr
            profit_percentage: parseFloat(
              (
                ((data.value - data.base_value) / data.base_value) *
                100
              ).toFixed(2)
            ), // Calculate initial profit_percentage
          }))
          console.log('Updated Data:', updatedData) // Log the updated data
          setDatas(updatedData)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    calc()
    // handleSort('profit_percentage')
  }, [datas])

  return (
    <>
      <div className='flex gap-4'>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
            <BuildingLibraryIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Total</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {totalValue}
              </strong>
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <CreditCardIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Capital</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {totalCapital}
              </strong>
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
            <ChevronDoubleUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Profit (MYR)
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {totalProfit}
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-600'>
            <ChevronDoubleDownIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Profit (%)</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {((totalProfit / totalCapital) * 100).toFixed(2)}
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
      <div className='h-[35rem] mt-3 overflow-auto bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                onClick={() => handleSort('name')}>
                Investment{' '}
                {sortConfig.key === 'name' &&
                  (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs text-center align-middle font-medium text-gray-500 uppercase tracking-wider'
                onClick={() => handleSort('value')}>
                Total (MYR){' '}
                {sortConfig.key === 'id' &&
                  (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs text-center align-middle font-medium text-gray-500 uppercase tracking-wider'
                onClick={() => handleSort('base_value')}>
                Capital (MYR){' '}
                {sortConfig.key === 'id' &&
                  (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs text-center align-middle font-medium text-gray-500 uppercase tracking-wider'
                onClick={() => handleSort('profit_myr')}>
                Profit (MYR){' '}
                {sortConfig.key === 'id' &&
                  (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs text-center align-middle font-medium text-gray-500 uppercase tracking-wider'
                onClick={() => handleSort('profit_percentage')}>
                Profit (%){' '}
                {sortConfig.key === 'id' &&
                  (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {datas &&
              datas.map((data) => (
                <tr key={data.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>{data.name}</td>
                  <td className='px-6 py-4 text-center align-middle whitespace-nowrap'>
                    {data.value}
                  </td>
                  <td className='px-6 py-4 text-center align-middle whitespace-nowrap'>
                    {data.base_value}
                  </td>
                  <td className='px-6 py-4 text-center align-middle whitespace-nowrap'>
                    {data.profit_myr}
                  </td>
                  <td className='px-6 py-4 text-center align-middle whitespace-nowrap'>
                    {data.profit_percentage}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

interface BoxWrapperProps {
  children: ReactNode
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({ children }) => {
  return (
    <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>
      {children}
    </div>
  )
}

export default Investment
