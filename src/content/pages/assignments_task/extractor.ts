import { DateTime } from 'luxon';

export interface AssignmentDetails {
    title: string;
    descriptionFiles: { name: string; link: string }[];
    note: string;
    className: string;
    gradeScale: string;
    teacher: string;
    studentTime: string;
    deadline: DateTime | null;
    groupMembers: string[];
    groupAddOptions: { id: string; name: string }[];
    submissions: {
        time?: DateTime;
        user: string;
        status?: string;
        absence?: string;
        completed?: boolean;
        grade?: string;
        gradeNote?: string;
        studentNote?: string;
        comment?: string;
        file?: { name: string; link: string };
    }[];
}

/**
 * Витягує дані завдання зі сторінки
 */
export const extractAssignment = (html: Document): AssignmentDetails => {
    const container = html.querySelector('div.lectioTabContent');
    if (!container) throw new Error('No assignment content found');

    // Основні дані
    const title = container.querySelector('#m_Content_NameLbl')?.textContent?.trim() ?? '';

    const descriptionFiles = Array.from(container.querySelectorAll('#m_Content_registerAfl_pa a'))
        .map((a) => ({
            name: a.textContent?.trim() ?? '',
            link: (a as HTMLAnchorElement).href
        }))
        .filter((f) => f.name && f.link);

    const note = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(3) td')?.textContent?.trim() ?? '';
    const className = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(4) td')?.textContent?.trim() ?? '';
    const gradeScale = container.querySelector('#m_Content_gradeScaleIdLbl')?.textContent?.trim() ?? '';
    const teacher = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(6) td')?.textContent?.trim() ?? '';
    const studentTime = container.querySelector('#m_Content_WeightLbl')?.textContent?.trim() ?? '';

    const deadlineRaw = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(8) td')?.textContent?.trim() ?? '';
    const deadline = deadlineRaw
        ? DateTime.fromFormat(deadlineRaw, 'd/M-yyyy HH:mm', { locale: 'da' })
        : null;

    // Групові дані
    const groupMembers = Array.from(container.querySelectorAll('#m_Content_groupMembersGV td span'))
        .map((el) => el.textContent?.trim() ?? '')
        .filter(Boolean);

    const groupAddOptions = Array.from(container.querySelectorAll('#m_Content_groupStudentAddDD option'))
        .map((opt) => ({
            id: (opt as HTMLOptionElement).value,
            name: opt.textContent?.trim() ?? ''
        }))
        .filter((o) => o.id && o.name);

    // Індивідуальні подання
    const submissions = Array.from(container.querySelectorAll('#m_Content_StudentGV tr'))
        .slice(1) // пропускаємо заголовок
        .map((row) => {
            const cells = Array.from(row.querySelectorAll('td'));
            const user = cells[1]?.textContent?.trim() ?? '';
            if (!user) return null; // пропустити пусті рядки

            const status = cells[2]?.textContent?.trim() ?? '';
            const absence = cells[3]?.textContent?.trim() ?? '';
            const completed = !!cells[4]?.querySelector('input[type=checkbox]:checked');
            const grade = cells[5]?.textContent?.trim() ?? '';
            const gradeNote = cells[6]?.textContent?.trim() ?? '';
            const studentNote = cells[7]?.textContent?.trim() ?? '';

            // Коментар та файл
            let comment: string | undefined;
            let file: { name: string; link: string } | undefined;

            const commentCell = cells[2];
            if (commentCell) {
                comment = commentCell.textContent?.trim() || undefined;
                const fileLink = commentCell.querySelector('a') as HTMLAnchorElement | null;
                if (fileLink) {
                    file = {
                        name: fileLink.textContent?.trim() ?? '',
                        link: fileLink.href
                    };
                }
            }

            return { user, status, absence, completed, grade, gradeNote, studentNote, comment, file };
        })
        .filter(Boolean) as AssignmentDetails['submissions'];

    return {
        title,
        descriptionFiles,
        note,
        className,
        gradeScale,
        teacher,
        studentTime,
        deadline,
        groupMembers,
        groupAddOptions,
        submissions
    };
};

/**
 * Додаткові функції для взаємодії
 */

// Додати студента до групи
export const addStudentToGroup = (studentId: string) => {
    const addBtn = document.getElementById('m_Content_groupStudentAddBtn') as HTMLAnchorElement | null;
    const select = document.getElementById('m_Content_groupStudentAddDD') as HTMLSelectElement | null;
    if (!addBtn || !select) return false;

    select.value = studentId;
    addBtn.click();
    return true;
};

// Відправити коментар або файл
export const sendCommentOrFile = (comment: string, fileId?: string) => {
    const commentBox = document.getElementById('m_Content_CommentsTB_tb') as HTMLTextAreaElement | null;
    if (!commentBox) return false;

    commentBox.value = comment;

    if (fileId) {
        const fileInput = document.getElementById('m_Content_choosedocument_selectedDocumentId') as HTMLInputElement | null;
        const fileBtn = document.getElementById('m_Content_choosedocument_choosedocBtn') as HTMLAnchorElement | null;
        if (fileInput && fileBtn) {
            fileInput.value = fileId;
            fileBtn.click();
            return true;
        }
    } else {
        const sendBtn = document.getElementById('m_Content_AddEntryBtn') as HTMLAnchorElement | null;
        sendBtn?.click();
        return true;
    }

    return false;
};
