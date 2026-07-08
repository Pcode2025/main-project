import { UserInputContext } from '@/app/_context/UserInputContext';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { generateWithOpenRouter } from '@/configs/AiModel'
import React, { useContext, useState } from 'react'
import { HiOutlineSparkles } from "react-icons/hi2"

function TopicDescription() {
    const {userCourseInput, setUserCourseInput} = useContext(UserInputContext);
    const [generating, setGenerating] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setUserCourseInput(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const generateTopicWithAI = async () => {
        if (!userCourseInput?.topic) return;
        setGenerating(true);
        try {
            const prompt = `Given the course topic "${userCourseInput.topic}"${userCourseInput?.category ? ` in the category "${userCourseInput.category}"` : ''}, generate a compelling course description in 2-3 sentences that explains what students will learn. Return ONLY a JSON object with this exact format: {"description": "your description here"}`
            const result = await generateWithOpenRouter(prompt, 'google/gemini-flash-1.5');
            const parsed = JSON.parse(result);
            if (parsed.description) {
                setUserCourseInput(prev => ({ ...prev, description: parsed.description }));
            }
        } catch (err) {
            console.error('AI generation failed:', err);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className='mx-20 lg:mx-44'>
            <div className='mt-5'>
                <label>Write the topic for which you want to generate a course (e.g., Python Course, Yoga, etc.):</label>
                <Input placeholder={'Topic'}
                    className="h-14 text-xl"
                    defaultValue={userCourseInput?.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                />
            </div>
            <div className='mt-5'>
                <div className='flex items-center justify-between mb-1'>
                    <label>Tell us more about your course, what you want to include in the course (Optional)</label>
                    <button
                        onClick={generateTopicWithAI}
                        disabled={!userCourseInput?.topic || generating}
                        className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity'
                    >
                        <HiOutlineSparkles className={generating ? 'animate-spin' : ''} />
                        {generating ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
                <Textarea
                    placeholder="About your course"
                    className="h-24 text-xl"
                    value={userCourseInput?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
            </div>
        </div>
    )
}

export default TopicDescription
