import { test, expect } from '@playwright/test';

const TODO_URL = 'https://todomvc.com/examples/react/dist/#/';

test.describe('TodoMVC tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(TODO_URL);
    });

    test('Add a new to-do', async ({ page }) => {
        await page.fill('.new-todo', 'Test ToDo');
        await page.keyboard.press('Enter');
        const todoText = await page.locator('.todo-list li').first().textContent();
        expect(todoText).toBe('Test ToDo');
    });

    test('Mark a to-do as complete', async ({ page }) => {
        await page.fill('.new-todo', 'Complete me');
        await page.keyboard.press('Enter');
        await page.click('.todo-list li .toggle');
        const isCompleted = await page.locator('.todo-list li').first().getAttribute('class');
        expect(isCompleted).toContain('completed');
    });

    test('Delete a to-do', async ({ page }) => {
        await page.fill('.new-todo', 'Delete me');
        await page.keyboard.press('Enter');
        await page.hover('.todo-list li');
        await page.click('.destroy');
        const todos = await page.locator('.todo-list li').count();
        expect(todos).toBe(0);
    });

    test('Filter by active tasks', async ({ page }) => {
        await page.fill('.new-todo', 'Active Task');
        await page.keyboard.press('Enter');
        await page.fill('.new-todo', 'Complete Task');
        await page.keyboard.press('Enter');
        await page.click('.todo-list li:nth-child(2) .toggle');
        await page.click('text=Active');
        const visibleTodos = await page.locator('.todo-list li').count();
        expect(visibleTodos).toBe(2);
        const todoText = await page.locator('.todo-list li').first().textContent();
        expect(todoText).toBe('Active Task');
    });

    test('Filter by completed tasks', async ({ page }) => {
        await page.fill('.new-todo', 'Task A');
        await page.keyboard.press('Enter');
        await page.fill('.new-todo', 'Task B');
        await page.keyboard.press('Enter');
        await page.click('.todo-list li:nth-child(2) .toggle');
        await page.click('text=Completed');
        const visibleTodos = await page.locator('.todo-list li').count();
        expect(visibleTodos).toBe(1);
        const todoText = await page.locator('.todo-list li').first().textContent();
        expect(todoText).toBe('Task B');
    });

    test('Clear all completed tasks', async ({ page }) => {
        await page.fill('.new-todo', 'Task to complete');
        await page.keyboard.press('Enter');
        await page.click('.todo-list li .toggle');
        await page.click('.clear-completed');
        const todos = await page.locator('.todo-list li').count();
        expect(todos).toBe(0);
    });


    test('Double click and edit a to-do', async ({ page }) => {
        // Add a new to-do
        await page.fill('.new-todo', 'Task to edit');
        await page.keyboard.press('Enter');

        // Locate the first to-do item
        const todoItem = page.locator('.todo-list li');

        // Double-click to enter edit mode
        await todoItem.dblclick();

        // Wait for the edit input field to be visible
        const editInput = page.locator('.todo-list li.editing .edit');
        await editInput.waitFor({ state: 'visible' });

        // Fill in the new task name
        await editInput.fill('Edited Task');
        await page.keyboard.press('Enter');

        // Verify that the task text was updated
        const todoText = await todoItem.first().textContent();
        expect(todoText).toBe('Edited Task');
    });
});
