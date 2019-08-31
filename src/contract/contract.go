package main

import (
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(add, value, createPage, getPage)
var SYSTEM = sdk.Export(_init)

var COUNTER_KEY = []byte("counter")

func _init() {

}

func add(i uint64) uint64 {
	v := value() + i
	state.WriteUint64(COUNTER_KEY, v)

	return v
}

func createPage(title string, content string) {

}

func getPage(title string) string {
	return "Iggy Pop is amazing"
}

func value() uint64 {
	return state.ReadUint64(COUNTER_KEY)
}
