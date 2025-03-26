import os
import re
import json

def parse_knowledge_check(markdown_content):
    # Extract domain and module
    domain_match = re.search(r'\*\*\*Domain:\*\*\* (.*)', markdown_content)
    module_match = re.search(r'\*\*\*Module:\*\*\* (.*)', markdown_content)
    
    domain = domain_match.group(1).strip() if domain_match else None
    module = module_match.group(1).strip() if module_match else None
    
    # Split the content into individual questions
    questions_raw = re.split(r'##### Question \d+', markdown_content)[1:]
    
    parsed_questions = []
    
    for question in questions_raw:
        # Extract full question text
        question_text_match = re.search(r'^(.*?)\n\n-', question, re.DOTALL | re.MULTILINE)
        
        if question_text_match:
            question_text = question_text_match.group(1).strip()
        else:
            # Fallback method if first match fails
            question_text_match = re.search(r'^(.*?)(?=\n-)', question, re.DOTALL | re.MULTILINE)
            question_text = question_text_match.group(1).strip() if question_text_match else "Question text not found"
        
        # Extract choices (both checked and unchecked)
        choices_matches = re.findall(r'- \[[ x]\] (.*)', question)
        
        # Extract correct answers (handle multiple answers)
        correct_answer_match = re.search(r'\*\*Correct Answer\*\*: (.*)', question)
        correct_answers = correct_answer_match.group(1).split(', ') if correct_answer_match else []
        
        # Extract explanation
        explanation_match = re.search(r'\*\*Explanation\*\*: (.*)', question)
        explanation = explanation_match.group(1) if explanation_match else None
        
        # Construct question object
        parsed_question = {
            "text": question_text,
            "choices": choices_matches,
            "correctAnswers": correct_answers,
            "explanation": explanation
        }
        
        parsed_questions.append(parsed_question)
    
    # Construct final output object
    output = {
        "domain": domain,
        "module": module,
        "questions": parsed_questions
    }
    
    return output

def process_knowledge_check_files(root_path):
    processed_files = []

    # Walk through all directories and subdirectories
    for dirpath, _, filenames in os.walk(root_path):
        for filename in filenames:
            # Check if filename matches "Knowledge Check" and is a markdown file
            if "Knowledge Check" in filename and filename.endswith('.md'):
                file_path = os.path.join(dirpath, filename)
                
                try:
                    # Read the markdown file
                    with open(file_path, 'r', encoding='utf-8') as file:
                        markdown_content = file.read()
                    
                    # Parse the knowledge check
                    parsed_data = parse_knowledge_check(markdown_content)
                    
                    # Get parent folder name for filename
                    parent_folder = os.path.basename(os.path.dirname(file_path))
                    processed_files.append({
                        'filename': parent_folder.lower().replace(' - ', '_').replace(' ', '_') + '.json',
                        'data': parsed_data
                    })
                    
                    print(f"Processed: {file_path}")
                
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return processed_files

def main(root_path):
    # Process all Knowledge Check markdown files
    processed_data = process_knowledge_check_files(root_path)
    
    # Prepare output directory
    output_dir = os.path.join('storage/json/aws_ai_practitioner/output')
    os.makedirs(output_dir, exist_ok=True)
    
    # Write each processed file to a separate JSON file
    for item in processed_data:
        output_path = os.path.join(output_dir, item['filename'])
        
        with open(output_path, 'w', encoding='utf-8') as outfile:
            json.dump(item['data'], outfile, indent=2, ensure_ascii=False)
    
    print(f"\nProcessed {len(processed_data)} Knowledge Check files.")
    print(f"Output saved to: {output_dir}")

if __name__ == "__main__":
    # Ask user for the root path to search
    import sys
    if len(sys.argv) > 1:
        root_path = sys.argv[1]
    else:
        root_path = input("Enter the root path to search for Knowledge Check files: ")
    
    main(root_path)