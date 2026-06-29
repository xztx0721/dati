import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from docx import Document
import json

doc = Document(r'c:\Users\hp\Desktop\AI基础A复习题库_200题.docx')

questions = []
current_question = None

for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue
    
    if text[0].isdigit() and '.' in text[:5]:
        if current_question:
            questions.append(current_question)
        num_end = text.index('.')
        q_num = int(text[:num_end])
        q_content = text[num_end+1:].strip()
        current_question = {
            'id': q_num,
            'content': q_content,
            'options': [],
            'answer': '',
            'analysis': '',
            'type': 'choice'
        }
    elif text.startswith('A.'):
        if current_question:
            current_question['options'].append(text)
    elif text.startswith('B.'):
        if current_question:
            current_question['options'].append(text)
    elif text.startswith('C.'):
        if current_question:
            current_question['options'].append(text)
    elif text.startswith('D.'):
        if current_question:
            current_question['options'].append(text)
    elif text.startswith('【答案】'):
        if current_question:
            current_question['answer'] = text.replace('【答案】', '').strip()
            if not current_question['options']:
                current_question['type'] = 'fill'
    elif text.startswith('【知识点】'):
        if current_question:
            current_question['analysis'] = text.replace('【知识点】', '').strip()

if current_question:
    questions.append(current_question)

with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"共提取 {len(questions)} 道题目")
print(f"选择题: {sum(1 for q in questions if q['type'] == 'choice')}")
print(f"填空题: {sum(1 for q in questions if q['type'] == 'fill')}")

for i, q in enumerate(questions[:10], 1):
    print(f"\n第{q['id']}题 ({q['type']}):")
    print(f"内容: {q['content']}")
    if q['options']:
        print(f"选项: {q['options']}")
    print(f"答案: {q['answer']}")
    print(f"解析: {q['analysis']}")