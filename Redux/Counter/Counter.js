import React from 'react'
import { View, Text, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'

export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <View>
      <View>
        <Button
            title='Increment'
            accessibilityLabel="Increment value"
            onClick={() => dispatch(increment())}
        />
        <Text>{count}</Text>
        <Button
            title='Decrement'
            accessibilityLabel="Decrement value"
            onClick={() => dispatch(decrement())}
        />
      </View>
    </View>
  )
}