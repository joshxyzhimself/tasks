// @ts-check

// Tasks (draft)
// [x] v1: Asana-like layout
// [x] v1: Indented tasks for sub-tasks
// [x] v1: LocalStorage
// [x] v1: Hotkeys
// [x] v1: Task completion date
// [x] v1: Task sync across tabls thru window 'storage' events
// [ ] v2: Task Subtasks expand / collapse
// [ ] v2: Task phases: Under Review, Planned, In Progress, Completed
// [ ] v2: Task phases: Backtick toggles forward, Tilde toggles backward
// [ ] v2: Local data import / export
// [ ] v2: Cloud data import / export
// [ ] v2: Publish at tasks.jxyz.me

/**
 * @typedef {import('./Tasks').task} task
 */

import React from 'react';
import * as luxon from 'luxon';
import { assert } from 'modules/assert.mjs';
import { useLocalStorage } from 'modules/useLocalStorage.mjs';


/**
 * @type {task}
 */
const default_task = {
  name: '',
  completed: false,
  completed_date: null,
  depth: 0,
};

/**
 * @param {boolean} completed
 * @param {number} depth
 */
const create_task_badge_class_name = (completed, depth) => {
  assert(typeof completed === 'boolean');
  assert(typeof depth === 'number');
  let task_badge_class_name = 'p-1 rounded-full cursor-pointer';
  const bg_color = completed ? 'emerald' : 'rose';
  const bg_weight = 500 + (depth * 100);
  task_badge_class_name += ` bg-${bg_color}-${bg_weight}`;
  return task_badge_class_name;
};

const focus_keys = new Set([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab']);

/**
 * @type {import('./Tasks').Tasks}
 */
export const Tasks = () => {

  /**
   * @type {[task[], React.Dispatch<task[]>]}
   */
  const [tasks, set_tasks] = useLocalStorage('tasks', [Object.assign({}, default_task)]);

  /**
   * @type {[number, React.Dispatch<number>]}
   */
  const [selected_index, set_selected_index] = React.useState(0);

  /**
   * @type {[number, React.Dispatch<number>]}
   */
  const [focused_index, set_focused_index] = React.useState(null);

  /**
   * @type {React.MutableRefObject<HTMLInputElement[]>}
   */
  const references = React.useRef([]);

  React.useEffect(() => {
    document.title = 'Tasks';
  }, []);

  // [x] allow re-focus on tasks thru focus_keys, when no task is focused
  React.useEffect(() => {
    /**
     * @param {KeyboardEvent} e
     */
    const key_down_listener = (e) => {
      if (focused_index === null) {
        if (focus_keys.has(e.key)) {
          e.preventDefault();
          set_selected_index(0);
        }
      }
    };
    window.addEventListener('keydown', key_down_listener);
    return () => {
      window.removeEventListener('keydown', key_down_listener);
    };
  }, [focused_index]);

  React.useEffect(() => {
    // [x] reset to default task
    if (tasks.length === 0) {
      set_tasks([Object.assign({}, default_task)]);
      set_selected_index(0);
    }
    // [x] re-align depth to max gap of 1, happens when you delete or unindent
    const updated_tasks = tasks.slice();
    let updated = false;
    for (let i = 0, l = tasks.length; i < l; i += 1) {
      const current = tasks[i];
      const previous = tasks[i - 1];
      const max_depth = i === 0 ? 0 : previous.depth + 1;
      if (current.depth > max_depth) {
        const updated_task = { ...current, depth: current.depth - 1 };
        updated_tasks[i] = updated_task;
        updated = true;
      }
    }
    if (updated === true) {
      set_tasks(updated_tasks);
    }
  }, [tasks, set_tasks]);

  React.useEffect(() => {
    if (typeof selected_index === 'number') {
      if (references.current[selected_index] instanceof HTMLElement) {
        const element = references.current[selected_index];
        if (element.focus instanceof Function) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          set_selected_index(null);
        }
      }
    }
  }, [selected_index]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full sm:w-5/6">

        <div className="p-2">
          <div className="p-2 text-center text-lg md:text-xl lg:text-2xl font-bold">
            Tasks
          </div>
        </div>

        <div className="p-2">
          { tasks.map((task, task_index) => {
            const subtasks = [];
            const next_tasks = tasks.slice(task_index + 1);
            for (let i = 0, l = next_tasks.length; i < l; i += 1) {
              const next_task = next_tasks[i];
              if (next_task.depth > task.depth) {
                subtasks.push(next_task);
              }
              if (next_task.depth <= task.depth) {
                break;
              }
            }
            const completed_subtasks = subtasks.filter((t) => t.completed === true);
            const completed = Math.floor((completed_subtasks.length / subtasks.length) * 100);
            return (
              <div
                tabIndex={-1}
                className="task"
                onClick={() => {
                  references.current[task_index].focus();
                }}
                key={'task'.concat(String(task_index))}
              >
                <div className="flex flex-row justify-start items-center gap-2" >
                  <div style={{ paddingLeft: task.depth * 32 }} />
                  <div
                    tabIndex={-1}
                    className={create_task_badge_class_name(task.completed, task.depth)}
                    onClick={() => {
                      const updated_task = {
                        ...task,
                        completed: task.completed === false ? true : false,
                        completed_date: task.completed === false ? luxon.DateTime.now().toISO() : null,
                      };
                      const updated_tasks = tasks.slice();
                      updated_tasks[task_index] = updated_task;
                      set_tasks(updated_tasks);
                      references.current[task_index].focus();
                    }}
                  >
                    <div className="w-20 text-center text-xs font-bold text-white">
                      { task.completed ? 'Completed' : 'Incomplete' }
                    </div>
                  </div>
                  <input
                    type="text"
                    className="task shrink"
                    value={task.name}
                    onFocus={() => {
                      set_focused_index(task_index);
                    }}
                    onBlur={() => {
                      set_focused_index(null);
                    }}
                    onKeyDown={(e) => {
                      switch (e.key) {
                        case 'Escape': {
                          e.preventDefault();
                          references.current[task_index].blur();
                          return;
                        }
                        case '`': {
                          e.preventDefault();
                          const updated_task = {
                            ...task,
                            completed: task.completed === false ? true : false,
                            completed_date: task.completed === false ? luxon.DateTime.now().toISO() : null,
                          };
                          const updated_tasks = tasks.slice();
                          updated_tasks[task_index] = updated_task;
                          set_tasks(updated_tasks);
                          return;
                        }
                        case 'Backspace': {
                          if (task.name === '') {
                            e.preventDefault();
                            const updated_tasks = tasks.slice();
                            updated_tasks.splice(task_index, 1);
                            set_tasks(updated_tasks);
                            set_selected_index(task_index - 1);
                            return;
                          }
                          break;
                        }
                        case 'Delete': {
                          if (tasks[task_index + 1] instanceof Object) {
                            if (tasks[task_index + 1].name === '') {
                              e.preventDefault();
                              const updated_tasks = tasks.slice();
                              updated_tasks.splice(task_index + 1, 1);
                              set_tasks(updated_tasks);
                              return;
                            }
                          }
                          break;
                        }
                        case 'Tab': {
                          if (e.shiftKey === true) {
                            e.preventDefault();
                            const updated_task = { ...task, depth: Math.max(0, task.depth - 1) };
                            const updated_tasks = tasks.slice();
                            updated_tasks[task_index] = updated_task;
                            set_tasks(updated_tasks);
                            return;
                          } else {
                            if (task_index > 0 && task.depth <= tasks[task_index - 1].depth) {
                              e.preventDefault();
                              const updated_task = { ...task, depth: Math.min(4, task.depth + 1) };
                              const updated_tasks = tasks.slice();
                              updated_tasks[task_index] = updated_task;
                              set_tasks(updated_tasks);
                              return;
                            }
                          }
                          e.preventDefault();
                          break;
                        }
                        case 'Enter': {
                          e.preventDefault();
                          /**
                          * @type {task}
                          */
                          const updated_task = {
                            name: '',
                            completed: false,
                            completed_date: null,
                            depth: task.depth,
                          };
                          const updated_tasks = tasks.slice(0, task_index + 1);
                          updated_tasks.push(updated_task);
                          updated_tasks.push(...tasks.slice(task_index + 1));
                          set_tasks(updated_tasks);
                          set_selected_index(task_index + 1);
                          return;
                        }
                        case 'ArrowUp': {
                          if (e.shiftKey === true) {
                            e.preventDefault();
                            if (task_index > 0) {
                              const current = task;
                              const previous = tasks[task_index - 1];
                              if (current.depth === previous.depth) {
                                const updated_tasks = tasks.slice();
                                updated_tasks[task_index] = previous;
                                updated_tasks[task_index - 1] = current;
                                set_tasks(updated_tasks);
                                set_selected_index(task_index - 1);
                                return;
                              }
                            }
                          } else {
                            e.preventDefault();
                            set_selected_index(Math.max(0, task_index - 1));
                            return;
                          }
                          break;
                        }
                        case 'ArrowDown': {
                          if (e.shiftKey === true) {
                            e.preventDefault();
                            if (task_index < tasks.length - 1) {
                              const current = task;
                              const next = tasks[task_index + 1];
                              if (current.depth === next.depth) {
                                const updated_tasks = tasks.slice();
                                updated_tasks[task_index] = next;
                                updated_tasks[task_index + 1] = current;
                                set_tasks(updated_tasks);
                                set_selected_index(task_index + 1);
                                return;
                              }
                            }
                          } else {
                            e.preventDefault();
                            set_selected_index(Math.min(tasks.length - 1, task_index + 1));
                            return;
                          }
                          break;
                        }
                        default: {
                          break;
                        }
                      }
                      const current_value = references.current[task_index].value;
                      const previous_key = current_value.substring(current_value.length - 1);
                      const key = e.key;
                      switch (previous_key.concat(key)) {
                        case ',,': { // Unindent
                          e.preventDefault();
                          const updated_task = {
                            ...task,
                            depth: Math.max(0, task.depth - 1),
                            name: current_value.substring(0, current_value.length - 1),
                          };
                          const updated_tasks = tasks.slice();
                          updated_tasks[task_index] = updated_task;
                          set_tasks(updated_tasks);
                          return;
                        }
                        case '..': { // Indent
                          if (task_index > 0 && task.depth <= tasks[task_index - 1].depth) {
                            e.preventDefault();
                            const updated_task = {
                              ...task,
                              depth: Math.min(4, task.depth + 1),
                              name: current_value.substring(0, current_value.length - 1),
                            };
                            const updated_tasks = tasks.slice();
                            updated_tasks[task_index] = updated_task;
                            set_tasks(updated_tasks);
                            return;
                          }
                          e.preventDefault();
                          const updated_task = {
                            ...task,
                            name: current_value.substring(0, current_value.length - 1),
                          };
                          const updated_tasks = tasks.slice();
                          updated_tasks[task_index] = updated_task;
                          set_tasks(updated_tasks);
                          return;
                        }
                        default: {
                          break;
                        }
                      }
                    }}
                    onChange={(e) => {
                      const updated_task = { ...task, name: e.target.value };
                      const updated_tasks = tasks.slice();
                      updated_tasks[task_index] = updated_task;
                      set_tasks(updated_tasks);
                    }}
                    readOnly={task.completed}
                    ref={(element) => {
                      references.current[task_index] = element;
                    }}
                  />
                  { task.completed === true && (
                    <div className="text-center text-xs font-normal text-slate-600 whitespace-nowrap">
                      { luxon.DateTime.fromISO(task.completed_date).toRelativeCalendar() }
                    </div>
                  ) }
                  { task.completed === false && subtasks.length > 0 && (
                    <div className="flex flex-row justify-start items-center gap-2">
                      <div className="text-left text-xs font-normal text-slate-400">
                        { String(completed).concat('%') }
                      </div>
                      <div className="w-24 h-1 bg-rose-600">
                        <div className="h-1 bg-emerald-600" style={{ width: String(completed).concat('%') }}></div>
                      </div>
                    </div>
                  ) }
                </div>
              </div>
            );
          }) }
        </div>

        <div className="p-2">
          <div className="p-2 text-left text-base font-normal">
            Usage
          </div>
          <div className="p-2 flex flex-row justify-start items-center flex-wrap gap-2">
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Enter: add task
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Backspace: delete task (if empty)
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Delete: delete task below (if empty)
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Tab: indent task
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Shift + Tab: unindent task
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Backtick: toggle task completion
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Arrow Up: select task above
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Arrow Down: select task below
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Shift + Arrow Up: switch with task above (if same indention)
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Shift + Arrow Down: switch with task below (if same indention)
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Note: data is saved to / loaded from LocalStorage
            </div>
            <div className="p-1 text-left text-xs font-normal bg-slate-800 text-white rounded">
              Note: data is synced across tabs thru LocalStorage events
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};