package main

import (
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(add, value, createPage, createRevision, getPageRevisionCount, getPage)
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

func _pageShouldNotExist(title string) {
	if state.ReadString([]byte(title)) != "" {
		panic("page already exists!")
	}
}

func _pageShouldExist(title string) {
	if state.ReadString([]byte(title)) == "" {
		panic("page does not exist!")
	}
}

func createPage(title string, content string) {
	_pageShouldNotExist(title)
	state.WriteString([]byte(title), content)
	state.WriteUint64(revisionKey(title), 1)
}

func createRevision(title string, content string) {
	revision := getPageRevisionCount(title) + 1

	state.WriteString([]byte(title), content)
	state.WriteUint64(revisionKey(title), revision)

}
func revisionKey(title string) []byte {
	return []byte(title + "_rev")
}

func getPageRevisionCount(title string) uint64 {
	_pageShouldExist(title)
	return state.ReadUint64(revisionKey(title))
}

func getPage(title string) string {
	_pageShouldExist(title)
	return state.ReadString([]byte(title))
}
