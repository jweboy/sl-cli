/*
 * @Author: jweboy
 * @Date: 2019-12-18 18:55:17
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-03 13:02:19
 */
import React from 'react'
import styles from './index.less';
import Card from './Card'

export default function() {
  return (
    <div className={styles.normal}>
      <h1>I am a umi block!</h1>
      <Card />
    </div>
  );
}

