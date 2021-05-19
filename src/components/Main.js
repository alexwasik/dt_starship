import React, { useEffect, useState } from 'react'
import { Select, Table, Row, Col, Typography } from 'antd'
import axios from 'axios'
import { columns } from '../helpers/tableConfig'

const Main = () => {
  const [starshipData, setStarshipData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState({})

  const { Option } = Select
  const { Title } = Typography

  const filteredSource = Object.keys(selected).length ? selected : starshipData

  const fetchStarships = async () => {
    try {
      const results = await axios('https://swapi.dev/api/starships');
      const shipCount = results.data.count
      
      setStarshipData(results.data.results)

      if (shipCount >= 10) {
        // round up the divisible count, start with page 2 and fetch remaining data data
        for (let i = 2; i < Math.ceil(shipCount/10) + 1; i++) {
          const nextData = await axios(`http://swapi.dev/api/starships/?page=${i}`)
          const nextDataShips = nextData.data.results
          // add new data to array
          setStarshipData(prevList => [...prevList, ...nextDataShips])
        }
      }

      setLoading(false)
    } catch (error) {
      console.error('fetch error', error)
      setLoading(false)
    }
  }
  
  useEffect(() => {
    //on component mount, fetch data
    fetchStarships()
  },[])

  const handleSelectChange = (value) => {
    //filter list to selected manufacturer
    const filterObj = starshipData.filter(ship => ship.manufacturer.includes(value))
    setSelected(filterObj)
  }

  const getUniqueManufactures = () => {
    let manufacturers = []
    // HACK! Someone decided it would be awesome to make `manufacturer` a comma separated string but add these to the string... with a comma
    const remove = ['Inc', 'Inc.', 'Incorporated']
    
    // eslint-disable-next-line array-callback-return
    starshipData.map(ship => {
      const man = ship.manufacturer.split(', ')
      manufacturers.push(...man)
    })
    // So I removed them ¯\_(ツ)_/¯
    const uniqueManufactures = [...new Set(manufacturers)].filter(item => !remove.includes(item))

    return uniqueManufactures
  }
  
  return (
    <>
      <Row justify='center'>
        <Title level={2}>Starship Wookiepedia</Title>
      </Row>
      <Row>
        <Col
          style={{ paddingBottom: 15 }}
          span={6}
        >
          <Select
            allowClear
            style={{width: '100%'}}
            placeholder='Select Manufacturer'
            loading={loading}
            onChange={handleSelectChange}
          >
            {!loading && getUniqueManufactures().map((man, i) => {
              return <Option key={i} value={man}>{man}</Option>
            })}
          </Select>
        </Col>
      </Row>
        <Row>
        <Table
          columns={columns} 
          dataSource={filteredSource}
          rowKey={record => record.name}
          loading={loading}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            size: 'small',
          }}
        />
      </Row>
    </>
  )
}

export default Main;
