import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Agent from "../lib/agent";

const todosAgent = new Agent("todos");

export default function List() {
  const router = useRouter();

  const [draftTask, setDraftTask] = useState("");

  const [todos, setTodos] = useState([]);

  const listId = router.query.listId as string;

  const getTodos = useCallback(async () => {
    console.log("getting todos");
    const allTodos = await todosAgent.getView("all", {
      list: listId,
    });
    setTodos(allTodos);
  }, [listId]);

  useEffect(() => {
    getTodos();
  }, [listId]);

  const todosByState = useMemo(() => {
    const byState = {
      incomplete: [],
      complete: [],
    };
    for (const todo of todos) {
      if (todo.done) {
        byState.complete.push(todo);
      } else {
        byState.incomplete.push(todo);
      }
    }
    return byState;
  }, [todos]);

  const createTask = useCallback(async () => {
    await todosAgent.runAction("add", {
      list: listId,
      message: draftTask,
    });
    setDraftTask("");
    getTodos();
  }, [draftTask, listId]);

  const completeTodo = useCallback(
    async (taskId) => {
      await todosAgent.runAction("complete", {
        id: taskId,
        listId: listId,
      });
    },
    [listId]
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3 style={{ margin: 0, alignSelf: "flex-start" }}>
        <Link href="/">{"⬅ Back"}</Link>
      </h3>
      <h1>
        <span style={{ fontSize: "0.5em" }}>TASKS IN: </span>
        {listId.toLocaleUpperCase()}
      </h1>
      <form
        style={{ marginBottom: "20px" }}
        onSubmit={(e) => {
          e.preventDefault();
          createTask();
        }}
      >
        <label>
          <div style={{ color: "darkgray" }}>New Task</div>
          <input
            value={draftTask}
            onChange={(e) => setDraftTask(e.target.value)}
            placeholder="Cancel Hulu subscription"
          />
        </label>
      </form>
      <div>
        {todosByState.incomplete.map(({ message, id, done }) => {
          return (
            <div key={id} style={{ display: "flex" }}>
              <input
                readOnly
                onClick={async () => {
                  await completeTodo(id);
                  getTodos();
                }}
                type="checkbox"
                checked={done}
              />
              <div key={id}>{message}</div>
            </div>
          );
        })}
        <hr />
        {todosByState.complete.map(({ message, id, done }) => {
          return (
            <div
              key={id}
              style={{ display: "flex", textDecoration: "line-through" }}
            >
              <input readOnly type="checkbox" checked />
              <div key={id}>{message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
