/*
 * @Author: jweboy
 * @Date: 2019-12-18 18:55:17
 * @LastEditors  : jweboy
 * @LastEditTime : 2019-12-18 18:57:27
 */
import React from 'react'
import styles from './index.less';
console.log(styles)
import Card from './components/Card'

export default function() {
  return (
    <div className={styles.normal}>
      <h1>I am a umi block!</h1>
      <Card />
    </div>
  );
}

