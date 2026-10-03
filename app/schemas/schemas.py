from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.models import UserRole, CaseStatus

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.STUDENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    is_verified: bool
    is_active: bool
    opt_out_repository: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class CourseCreate(BaseModel):
    code: str
    title: str

class CourseResponse(BaseModel):
    id: int
    code: str
    title: str
    join_code: str
    instructor_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CourseJoin(BaseModel):
    join_code: str

class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    allow_student_report_view: bool = True
    exclude_quotes: bool = True
    exclude_bibliography: bool = True
    min_match_words: int = 5
    excluded_phrases: Optional[str] = None
    exclude_from_repository: bool = False

class AssignmentResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    allow_student_report_view: bool
    exclude_quotes: bool
    exclude_bibliography: bool
    min_match_words: int
    excluded_phrases: Optional[str] = None
    exclude_from_repository: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    filename: str
    file_type: str
    file_size_bytes: int
    status: str
    progress: int
    error_message: Optional[str] = None
    case_status: CaseStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CommentCreate(BaseModel):
    match_id: Optional[str] = None
    comment: str
    is_acceptable_citation: bool = False

class CommentResponse(BaseModel):
    id: int
    submission_id: int
    author_id: int
    match_id: Optional[str] = None
    comment: str
    is_acceptable_citation: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MatchDetail(BaseModel):
    match_id: str
    source_id: str
    source_title: str
    source_type: str
    source_url: Optional[str] = None
    author: Optional[str] = None
    similarity_percentage: float
    submitted_text: str
    matched_text: str
    start_paragraph: int
    end_paragraph: int
    page_number: Optional[int] = 1
    is_excluded: bool = False
    exclusion_reason: Optional[str] = None

class SimilarityReportResponse(BaseModel):
    id: int
    submission_id: int
    overall_similarity: float
    repo_similarity: float
    web_similarity: float
    open_access_similarity: float
    peer_similarity: float
    matches: List[MatchDetail]
    web_search_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
