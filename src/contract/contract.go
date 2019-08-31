package main

import (
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(add, value, createPage, createRevision, getPage)
var SYSTEM = sdk.Export(_init)

var COUNTER_KEY = []byte("counter")

func _init() {

}

func add(i uint64) uint64 {
	v := value() + i
	state.WriteUint64(COUNTER_KEY, v)

	return v
}

func value() uint64 {
	return state.ReadUint64(COUNTER_KEY)
}

func _checkIfExist(title string) {
	if state.ReadString([]byte(title)) != "" {
		panic("page already exists!")
	}
}

func _checkIfNotExist(title string) {
	if state.ReadString([]byte(title)) == "" {
		panic("page does not exists!")
	}
}

func createPage(title string, content string) {
	_checkIfExist(title)
	state.WriteString([]byte(title), content)
}

func createRevision(title string, content string) {
	_checkIfNotExist(title)
	state.WriteString([]byte(title), content)
}

func getPage(title string) string {
	return state.ReadString([]byte(title))
}
