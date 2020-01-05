import React from 'react'
import { Button, Alert, Tag, Switch } from 'antd'
import styles from './index.less';
// import * as _styles from './text.less'


const isNumber = (num: number) => {

}

const Card = () => {
  return (
    <div>
      <div className={`${styles.card}`}>card.////////\\\\====----ppp.</div>
      <Button type="primary">click.me。--//////==--。。</Button>
      <Alert message="hhaha" type="success" />
      <Tag color="orange">tag</Tag>
      <Button type="danger">Danger</Button>
      <Button type="link">Link</Button>
      <Switch defaultChecked />
      {isNumber(9)}
    </div>
  )
}

export default Card;
